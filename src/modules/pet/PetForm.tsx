import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '../../components/ui/card';
import { FileUpload } from '../../components/ui/file-upload';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import type { FileUploadResponse } from '../../schema/file';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod/v4'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useCreateMutation, useUpdateMutation } from '../../services/mutation/pet';
import { useGetPetById } from '../../services/queries/pet';

export function PetForm() {
    const { id } = useParams({ from: '/_home/pet/$id' });

    const createMutation = useCreateMutation()
    const updateMutation = useUpdateMutation()
 
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [hasSetInitialValues, setHasSetInitialValues] = useState(false)


    const formSchema = z.object({
        id: z.number().optional(),
        ageYears: z.number().min(1, "Please enter age"),
        fullname: z.string().min(1, "Please enter name"),
        breed: z.string().min(1, "Please enter breed"),        
        gender: z.string().min(1, "Please select gender"),
        species: z.string().min(1, "Please select species"),
        picture: z.number(),
        description: z.string().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: standardSchemaResolver(formSchema),
        defaultValues: {
            ageYears: 0,
            fullname: "",
            breed: "",
            gender: "Male",
            picture: 0,
            species: "",
            description: "",
        }
    });

    let petData: any = {
        ageYears: 0,
        fullname: "",
        breed: "",
        dateofbirth: new Date(),
        gender: "",
        picture: 0,
        description: "",
    };

    let isPending = false;

    if (id !== "new") {
        const queryResult = useGetPetById(id);
        isPending = queryResult.isPending;
        petData = queryResult.data || petData;

        console.log("petData==>",petData);
        
        if(petData?.data && !hasSetInitialValues){
            const { id, ageYears, fullname, species, breed, gender } = petData?.data;
            
            form.setValue('ageYears', ageYears)
            form.setValue('fullname', fullname)
            form.setValue('breed', breed)
            form.setValue('species', species)
            form.setValue('gender', gender)            
            form.setValue('id', id) 
            form.setValue('picture', petData?.data?.picture || "")

            setHasSetInitialValues(true);
        }
    }

    const onFileUpload = (event: FileUploadResponse) => {
        
        if (event.status) {
            form.setValue('picture', event.data.id)
            toast.success("File uploaded successfully")
        }
    }


    const onSubmit = async () => {
        try {
            console.log("form.getValues()",form.getValues());
        
            const model = { ...form.getValues() } 
            console.log("model",model);
            const result = formSchema.safeParse({ ...model })
            console.log("result",result);
            if (!result.success) {
                toast.error("Validation failed.")
                return
            }

            const payLoad = result.data;
            setIsLoading(true);
            if (payLoad?.id) {
                const { id, ...bodyToUpdate } = payLoad
                updateMutation.mutate({ id: id, body: bodyToUpdate }, {
                    onSuccess: () => {
                        toast.success("Record updated.")
                        setIsLoading(false);
                        navigate({
                            to : '/pets',
                            search : { page : 1, limit : 10 }
                        })
                    },
                    onError: (error: any) => {
                        console.log("error", error);
                        const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
                        toast.error(msg)
                        setIsLoading(false);
                    }
                })
            } else {
                createMutation.mutate(payLoad, {
                    onSuccess: () => {
                        toast.success("Record added.")
                        setIsLoading(false);
                        navigate({
                            to : '/pets',
                            search : { page : 1, limit : 10 }
                        })
                    },
                    onError: (error: any) => {
                        const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
                        toast.error(msg)
                        setIsLoading(false);
                    }
                })
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
        }
    }


    if (isPending) {
        return (
            <div className="flex items-center justify-center h-48">
                <p className="font-semibold">
                    Loading
                </p>
                <div className="px-2">
                    <Skeleton className="h-[10px] w-[50px] rounded-full" />
                </div>
            </div>
        );
    }


    return <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardHeader>
                        <CardDescription>Enter pet details</CardDescription>
                    </CardHeader>
                    <CardContent>

                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Fullname</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name"  {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Bread</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bread"  {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ageYears"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Age (year)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter age year"
                                            type="number"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={(e) => {
                                                console.log("form.getValues()",form.getValues());
                                                field.onChange(e.target.value ? Number(e.target.value) : "")
                                                    
                                             }
                                            } // Convert to number
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="picture"
                            render={() => (
                                <FormItem className='my-5'>
                                    <FormLabel>Picture</FormLabel>
                                    <FormControl>
                                        <FileUpload onSuccess={onFileUpload} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                      
                    <FormField
                            control={form.control}
                            name="species"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Species</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={"Dog"}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Species" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem key={"Dog"} value={"Dog"}>{"Dog"}</SelectItem>
                                            <SelectItem key={"Cat"} value={"Cat"}>{"Cat"}</SelectItem>
                                            <SelectItem key={"Bird"} value={"Bird"}>{"Bird"}</SelectItem>
                                            <SelectItem key={"Reptile"} value={"Reptile"}>{"Reptile"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
 

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className='my-5' defaultValue={"Male"}>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="Male"
                                                    checked={field.value === "Male"}
                                                    onChange={() => field.onChange("Male")}
                                                    className="radio-input"
                                                />
                                                <span>Male</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="Female"
                                                    checked={field.value === "Female"}
                                                    onChange={() => field.onChange("Female")}
                                                    className="radio-input"
                                                />
                                                <span>Female</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="Unknown"
                                                    checked={field.value === "Unknown"}
                                                    onChange={() => field.onChange("Unknown")}
                                                    className="radio-input"
                                                />
                                                <span>Unknown</span>
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <div className='flex justify-end'>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Submit"}
                            </Button>
                            <Button type="button" className='mx-2' disabled={isLoading} onClick={() => {
                                navigate({
                                    to: '/pets',
                                    search: { page: 1, limit: 10 }
                                })
                            }}>
                                Cancel
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    </div>
}