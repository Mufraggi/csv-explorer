"use client";


import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {useEffect, useState} from "react";
import {Switch} from "@/components/ui/switch";


export interface FormCsvResult {
    file?: File;
    marketing_emails: boolean
}

const formSchemaClientSide = () => {
    if (typeof window !== "undefined") {
        return z.object({
            file: z.instanceof(FileList).optional(),
            marketing_emails: z.boolean().default(false),
        });
    }
    return z.object({
        file: z.any(),
        marketing_emails: z.boolean().default(false),
    });
};

interface CsvFromProps {
    onFileChange: (file: FormCsvResult) => void;
}
export interface FormCsvResult {
    file?: File;
    marketing_emails: boolean;
}
type FormData = z.infer<ReturnType<typeof formSchemaClientSide>>;

export default function CsvFrom({onFileChange}: CsvFromProps) {
    const [formSchema, setFormSchema] = useState<z.ZodObject<any>>(formSchemaClientSide());

    useEffect(() => {
        if (typeof window !== "undefined") {
            setFormSchema(
                z.object({
                    file: z.instanceof(FileList).optional(),
                    marketing_emails: z.boolean().default(false)
                })
            );
        }
    }, []);
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            marketing_emails: false,
        },
    });

    const fileRef = form.register("file");

    const onSubmit = (data: { file?: FileList, marketing_emails: boolean }) => {
        console.log(data);
        if (data.file && data.file.length > 0) {
            const file = data.file[0];
            onFileChange({ file, marketing_emails: data.marketing_emails });
            console.log(file);
        } else {
            onFileChange({ file: undefined, marketing_emails: data.marketing_emails });
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-10">
                <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="marketing_emails"
                        render={({field}) => (
                            <FormItem
                                className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Marketing emails</FormLabel>
                                    <FormDescription>
                                        Receive emails about new products, features, and more.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="file"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>File</FormLabel>
                                <FormControl>
                                    <Input type="file" placeholder="shadcn" {...fileRef} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        );
                    }}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}