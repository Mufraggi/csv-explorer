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
    hasHeader: boolean
}

const formSchemaClientSide = () => {
    if (typeof window !== "undefined") {
        return z.object({
            file: z.instanceof(FileList).optional(),
            hasHeader: z.boolean().default(false),
        });
    }
    return z.object({
        file: z.any(),
        hasHeader: z.boolean().default(false),
    });
};

interface CsvFromProps {
    onFileChange: (form: FormCsvResult) => void;
}
export interface FormCsvResult {
    file?: File;
    hasHeader: boolean;
}
type FormData = z.infer<ReturnType<typeof formSchemaClientSide>>;

export default function CsvFrom(formProps: CsvFromProps) {
    const [formSchema, setFormSchema] = useState<z.ZodObject<any>>(formSchemaClientSide());

    useEffect(() => {
        if (typeof window !== "undefined") {
            setFormSchema(
                z.object({
                    file: z.instanceof(FileList).optional(),
                    hasHeader: z.boolean().default(false)
                })
            );
        }
    }, []);
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hasHeader: false,
        },
    });

    const fileRef = form.register("file");

    const onSubmit = (data: { file?: FileList, hasHeader: boolean }) => {
        console.log(data);
        if (data.file && data.file.length > 0) {
            const file = data.file[0];
            formProps.onFileChange({ file, hasHeader: data.hasHeader });
            console.log(file);
        } else {
            formProps.onFileChange({ file: undefined, hasHeader: data.hasHeader });
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-10">
                <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="hasHeader"
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