import { useState, useMemo } from "react";
import { Download, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, User, Mail, Filter, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BatchGradingResult } from "@/lib/grade-with-scores";
import { ExtractedQuestion } from "@/lib/extract-questions";
import { SendEmailModal } from "@/components/SendEmailModal";

interface BatchGradingResultsProps {
  results: BatchGradingResult[];
  questions: ExtractedQuestion[];
  onStartOver: () => void;
}

export function BatchGradingResults({
  results,
  questions,
  onStartOver,
}: BatchGradingResultsProps) {
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((result) =>
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((result) => result.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case "score":
          const scoreA = a.result?.overall_assessment.total_score ?? 0;
          const scoreB = b.result?.overall_assessment.total_score ?? 0;
          comparison = scoreA - scoreB;
          break;
        case "grade":
          const gradeA = a.result?.overall_assessment.letter_grade ?? "";
          const gradeB = b.result?.overall_assessment.letter_grade ?? "";
          comparison = gradeA.localeCompare(gradeB);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [results, searchTerm, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Student name",
      "Status",
      "Total score",
      "Max score",
      "Grade",
      "Error",
    ];

    const rows = results.map((result) => [
      result.studentName,
      result.status === "success" ? "Success" : "Error",
      result.result?.overall_assessment.total_score ?? "-",
      result.result?.overall_assessment.total_max_score ?? "-",
      result.result?.overall_assessment.letter_grade ?? "-",
      result.error ?? "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `grading-results-${Date.now()}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold mb-4">
              Grading results
            </h1>
            <p className="text-lg text-muted-foreground">
              {successCount} exam(s) graded successfully
              {errorCount > 0 && ` • ${errorCount} error(s)`}
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" />
              <h3 className="font-semibold">Filters & Search</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success Only</SelectItem>
                  <SelectItem value="error">Errors Only</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("name")}
                  className="flex-1"
                >
                  Name
                  {sortBy === "name" && (
                    sortOrder === "asc" ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("score")}
                  className="flex-1"
                >
                  Score
                  {sortBy === "score" && (
                    sortOrder === "asc" ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>
            {filteredAndSortedResults.length !== results.length && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredAndSortedResults.length} of {results.length} results
              </div>
            )}
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{results.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success</p>
                  <p className="text-2xl font-bold">{successCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold">{errorCount}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {filteredAndSortedResults.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "No grading results available"}
                </p>
              </Card>
            ) : (
              <div className="space-y-6 mb-8">
                {filteredAndSortedResults.map((result) => (
                  <Card key={result.examId} className="overflow-hidden">
                    <div
                      className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() =>
                        setExpandedStudentId(
                          expandedStudentId === result.examId ? null : result.examId
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="p-1">
                            {expandedStudentId === result.examId ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {result.studentName}
                            </h3>
                            {result.status === "success" && result.result && (
                              <p className="text-sm text-muted-foreground">
                                {result.result.overall_assessment.total_score}/
                                {result.result.overall_assessment.total_max_score} •{" "}
                                {result.result.overall_assessment.letter_grade}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          {result.status === "success" ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium">Success</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <span className="text-sm font-medium">Error</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                {expandedStudentId === result.examId && (
                  <div className="border-t border-border bg-muted/30 p-6">
                    {result.status === "success" && result.result ? (
                      <div className="space-y-6">
                        {/* Questions Details */}
                        <div className="space-y-4">
                          {result.result.grading_breakdown.map((item, idx) => (
                            <Card key={idx} className="overflow-hidden border">
                              <div
                                className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer hover:from-primary/10 hover:to-primary/15 transition-colors flex items-center justify-between"
                                onClick={() =>
                                  setExpandedQuestionId(
                                    expandedQuestionId === `${result.examId}-${idx}`
                                      ? null
                                      : `${result.examId}-${idx}`
                                  )
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <button className="p-1">
                                    {expandedQuestionId === `${result.examId}-${idx}` ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </button>
                                  <div>
                                    <h4 className="font-semibold">
                                      {item.category}
                                    </h4>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                    {item.proficiency_level}
                                  </span>
                                  <span className="font-bold text-lg">
                                    {item.score}/{item.max_score}
                                  </span>
                                </div>
                              </div>

                              {expandedQuestionId === `${result.examId}-${idx}` && (
                                <div className="p-6 space-y-4">
                                  {/* Question */}
                                  {item.question_text && (
                                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
                                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">
                                        Question
                                      </p>
                                      <p className="text-sm text-foreground whitespace-pre-wrap">
                                        {item.question_text}
                                      </p>
                                    </div>
                                  )}

                                  {/* Student Response */}
                                  {item.student_answer && (
                                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4">
                                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">
                                        Student answer
                                      </p>
                                      <p className="text-sm text-foreground whitespace-pre-wrap">
                                        {item.student_answer}
                                      </p>
                                    </div>
                                  )}

                                  {/* Teacher Justification */}
                                  <div className="rounded-lg bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 p-4">
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wide mb-2">
                                      Justification (Teacher)
                                    </p>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">
                                      {item.justification}
                                    </p>
                                  </div>

                                  {/* Feedback for Student */}
                                  <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4">
                                    <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
                                      Feedback for student
                                    </p>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">
                                      {item.student_comment}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>

                        {/* Summary */}
                        <div className="border-t border-border pt-6">
                          <h4 className="font-semibold mb-3">Summary</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {result.result.feedback.summary_note}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium mb-2 text-green-700 dark:text-green-400">
                                Strengths
                              </h5>
                              <ul className="space-y-1">
                                {result.result.feedback.strengths.map(
                                  (strength, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-muted-foreground"
                                    >
                                      • {strength}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium mb-2 text-amber-700 dark:text-amber-400">
                                Areas to improve
                              </h5>
                              <ul className="space-y-1">
                                {result.result.feedback.areas_for_improvement.map(
                                  (area, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-muted-foreground"
                                    >
                                      • {area}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="font-medium text-red-700 dark:text-red-400">
                          Grading error
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-6">
                <h4 className="font-semibold mb-3">Summary</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {result.result.feedback.summary_note}
                </p>
              variant="outline"
              className="flex-1 gap-2 min-w-[150px]"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4" />
              Export as CSV
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 min-w-[150px]"
              onClick={() => setIsEmailModalOpen(true)}
            >
              <Mail className="h-4 w-4" />
              Send by email
            </Button>
            <Button className="flex-1 gap-2 min-w-[150px]" onClick={onStartOver}>
              <RotateCcw className="h-4 w-4" />
              New grading
            </Button>
          </div>

          {/* Email Modal */}
          <SendEmailModal
            results={filteredAndSortedResults.filter(r => r.status === "success")}
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
          />
        </div>
      </div>
    </section>
  );
}
