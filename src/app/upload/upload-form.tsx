
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition, useCallback } from "react";
import debounce from "lodash.debounce";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, AlertTriangle, Loader2, X, Info } from "lucide-react";
import { checkDoiUniqueness } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  authors: z.array(z.object({ 
      name: z.string().min(1, "Author name is required."),
      isCorresponding: z.boolean().default(false),
    })
  ).min(1, "At least one author is required."),
  title: z.string().min(1, "Title is required."),
  volumeName: z.string().min(1, "Volume name is required."),
  volume: z.string().min(1, "Volume is required."),
  issue: z.string().min(1, "Issue is required."),
  pageNo: z.string().min(1, "Page number is required."),
  doi: z.string().min(1, "A valid DOI is required."),
  hasScopus: z.enum(["yes", "no"], { required_error: "Scopus selection is required." }),
  facultyId: z.string().min(1, "Faculty ID is required."),
  scopusId: z.string().min(1, "Scopus ID is required."),
  year: z.string().min(4, "Year must be 4 digits.").max(4, "Year must be 4 digits."),
  claimedBy: z.string().min(1, "This field is required."),
  authorNo: z.string().min(1, "This field is required."),
  isStudentScholar: z.enum(["yes", "no"], { required_error: "Student scholar selection is required." }),
  studentScholars: z.array(z.object({
      name: z.string().min(1, "Student author name is required."),
      id: z.string().min(1, "Student ID is required."),
    })).optional(),
  q1: z.string().min(1, "Q1 is required."),
  q2: z.string().min(1, "Q2 is required."),
}).superRefine((data, ctx) => {
    if (data.isStudentScholar === 'yes') {
      if (!data.studentScholars || data.studentScholars.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one student scholar must be added.",
          path: ['studentScholars']
        });
      }
    }
  });


type DoiStatus = {
  isDuplicate: boolean | null;
  message: string;
};

export function UploadForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isCheckingDoi, setIsCheckingDoi] = useState(false);
  const [doiStatus, setDoiStatus] = useState<DoiStatus>({ isDuplicate: null, message: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authors: [{ name: "", isCorresponding: false }],
      title: "",
      volumeName: "",
      volume: "",
      issue: "",
      pageNo: "",
      doi: "",
      facultyId: "",
      scopusId: "",
      year: "",
      q1: "",
      q2: "",
      studentScholars: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "authors",
  });

  const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({
    control: form.control,
    name: "studentScholars",
  });

  const watchAuthors = form.watch("authors");
  const watchIsStudentScholar = form.watch("isStudentScholar");

  const debouncedDoiCheck = useCallback(
    debounce((doi: string) => {
      if (doi.trim()) {
        setIsCheckingDoi(true);
        startTransition(async () => {
          const result = await checkDoiUniqueness(doi);
          setDoiStatus(result);
          setIsCheckingDoi(false);
        });
      } else {
        setDoiStatus({ isDuplicate: null, message: "" });
      }
    }, 500),
    []
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Submission Successful",
      description: "Your paper has been successfully submitted for review.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    });
    form.reset();
    setDoiStatus({ isDuplicate: null, message: "" });
  }

  const correspondingAuthor = watchAuthors?.find(a => a.isCorresponding);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="space-y-4 md:col-span-2">
            <FormLabel>Authors</FormLabel>
            {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4 p-2 border rounded-md">
                <span className="text-sm font-medium">{index + 1}.</span>
                <FormField
                    control={form.control}
                    name={`authors.${index}.name`}
                    render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormControl>
                        <Input placeholder={`Author ${index + 1} Name`} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`authors.${index}.isCorresponding`}
                    render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel className="!mt-0 text-sm">Corresponding (c)</FormLabel>
                    </FormItem>
                    )}
                />
                 {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ name: "", isCorresponding: false })}
            >
                Add Author
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="Paper Title" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField control={form.control} name="volumeName" render={({ field }) => (
                <FormItem><FormLabel>Volume Name</FormLabel><FormControl><Input placeholder="e.g., Proceedings of Science" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="volume" render={({ field }) => (
                <FormItem><FormLabel>Volume</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="issue" render={({ field }) => (
                <FormItem><FormLabel>Issue</FormLabel><FormControl><Input placeholder="e.g., 4" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="pageNo" render={({ field }) => (
                <FormItem><FormLabel>Page No.</FormLabel><FormControl><Input placeholder="e.g., 10-15" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><FormLabel>Year</FormLabel><FormControl><Input placeholder="e.g., 2024" {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <Input 
                        placeholder="e.g., 10.1000/xyz123" 
                        {...field} 
                        onChange={(e) => {
                            field.onChange(e);
                            debouncedDoiCheck(e.target.value);
                        }}
                        />
                        {isCheckingDoi && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
                    </div>
                    </FormControl>
                    {doiStatus.message && !isCheckingDoi && (
                        <div className={cn("flex items-center text-sm mt-2", 
                            doiStatus.isDuplicate ? "text-orange-600" : "text-green-600"
                        )}>
                            {doiStatus.isDuplicate ? <AlertTriangle className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                            {doiStatus.message}
                        </div>
                    )}
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField control={form.control} name="hasScopus" render={({ field }) => (
                <FormItem className="space-y-3"><FormLabel>Scopus?</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>

            <FormField control={form.control} name="facultyId" render={({ field }) => (
                <FormItem><FormLabel>Faculty ID</FormLabel><FormControl><Input placeholder="e.g., F12345" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="scopusId" render={({ field }) => (
                <FormItem><FormLabel>Scopus ID</FormLabel><FormControl><Input placeholder="e.g., 12345678900" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField
                control={form.control}
                name="claimedBy"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Claimed By</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an author" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {watchAuthors?.map((author, index) => (
                           author.name && <SelectItem key={index} value={author.name}>{author.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="authorNo"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Author No.</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select author number" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {watchAuthors?.map((author, index) => (
                            author.name && <SelectItem key={index} value={(index + 1).toString()}>{index + 1}</SelectItem>
                        ))}
                        {correspondingAuthor && correspondingAuthor.name && (
                            <SelectItem value="c">c (Corresponding)</SelectItem>
                        )}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField control={form.control} name="isStudentScholar" render={({ field }) => (
                <FormItem className="space-y-3 md:col-span-2"><FormLabel>Student Scholar?</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>

             {watchIsStudentScholar === "yes" && (
                <div className="space-y-4 md:col-span-2">
                    <FormLabel>Student Scholars</FormLabel>
                    {studentFields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-4 p-2 border rounded-md">
                            <span className="text-sm font-medium pt-2">{index + 1}.</span>
                            <FormField
                                control={form.control}
                                name={`studentScholars.${index}.name`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="sr-only">Student Author Name</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select student author" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {watchAuthors?.map((author, authorIndex) => (
                                                    author.name && <SelectItem key={authorIndex} value={author.name}>{author.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`studentScholars.${index}.id`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="sr-only">Student ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Student ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStudent(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => appendStudent({ name: "", id: "" })}
                    >
                        Add Student Scholar
                    </Button>
                    <FormMessage>{form.formState.errors.studentScholars?.root?.message}</FormMessage>
                </div>
            )}

             <FormField control={form.control} name="q1" render={({ field }) => (
                <FormItem><FormLabel>Q1</FormLabel><FormControl><Input placeholder="Q1" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="q2" render={({ field }) => (
                <FormItem><FormLabel>Q2</FormLabel><FormControl><Input placeholder="Q2" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

        </div>
        
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                Please double-check all fields before submission.
            </AlertDescription>
        </Alert>

        <Button type="submit" disabled={isPending || isCheckingDoi}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Paper
        </Button>
      </form>
    </Form>
  );
}


    