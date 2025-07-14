import type { ResearchPaper } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

type PapersTableProps = {
  papers: ResearchPaper[];
};

export function PapersTable({ papers }: PapersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[200px]">Title</TableHead>
          <TableHead className="min-w-[150px]">Author(s)</TableHead>
          <TableHead className="hidden xl:table-cell">Category</TableHead>
          <TableHead className="hidden md:table-cell">Department</TableHead>
          <TableHead className="hidden lg:table-cell">Year</TableHead>
          <TableHead className="hidden xl:table-cell">Journal</TableHead>
          <TableHead className="hidden xl:table-cell">Volume</TableHead>
          <TableHead className="hidden xl:table-cell">Issue</TableHead>
          <TableHead className="hidden xl:table-cell">Page No.</TableHead>
          <TableHead>DOI</TableHead>
          <TableHead className="hidden xl:table-cell">Scopus ID</TableHead>
          <TableHead className="hidden xl:table-cell">Faculty ID</TableHead>
          <TableHead className="hidden xl:table-cell">Claimed By</TableHead>
          <TableHead className="hidden xl:table-cell">Scopus?</TableHead>
          <TableHead className="hidden xl:table-cell">Student?</TableHead>
          <TableHead className="hidden xl:table-cell">Q1</TableHead>
          <TableHead className="hidden xl:table-cell">Q2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {papers.length > 0 ? (
          papers.map((paper) => (
            <TableRow key={paper.id}>
              <TableCell className="font-medium max-w-[250px] truncate">{paper.title}</TableCell>
              <TableCell className="max-w-[150px] truncate">{paper.authors.map(a => `${a.name}${a.isCorresponding ? '(c)' : ''}`).join(", ")}</TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge variant="secondary">{paper.category}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline">{paper.department}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {new Date(paper.publicationDate).getFullYear()}
              </TableCell>
              <TableCell className="hidden xl:table-cell max-w-[150px] truncate">
                {paper.journal}
              </TableCell>
              <TableCell className="hidden xl:table-cell">{paper.volume}</TableCell>
              <TableCell className="hidden xl:table-cell">{paper.issue}</TableCell>
              <TableCell className="hidden xl:table-cell">{paper.pageNo}</TableCell>
              <TableCell>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {paper.doi}
                </a>
              </TableCell>
              <TableCell className="hidden xl:table-cell">{paper.scopusId || '-'}</TableCell>
              <TableCell className="hidden xl:table-cell">{paper.facultyId}</TableCell>
              <TableCell className="hidden xl:table-cell">{paper.claimedBy}</TableCell>
              <TableCell className="hidden xl:table-cell">
                {paper.hasScopus ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                {paper.isStudentScholar ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
              </TableCell>
              <TableCell className="hidden xl:table-cell">{paper.q1}</TableCell>
              <TableCell className="hidden xl:table-cell">{paper.q2}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={17} className="h-24 text-center">
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
