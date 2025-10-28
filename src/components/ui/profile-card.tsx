import { Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";

interface ProfileCardProps {
    fullName: string;
    age: number;
    gender: string;
    breed: string;
    picture: string;
    species: string;
    isAvailableForAdoption?: boolean;
    className?: string;
    isAdmin?: boolean;
    adoptionStatus: string;
    adopter: any,
    onRequest: () => void;
    onAllocateSucess: () => void;
    onAllocateReject: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function ProfileCard({
    fullName,
    age,
    gender,
    breed,
    picture,
    species,
    isAvailableForAdoption,
    adoptionStatus,
    isAdmin,
    adopter,
    onRequest,
    onEdit,
    onDelete,
    onAllocateSucess,
    onAllocateReject,
    className,
}: ProfileCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <img
                    src={picture}
                    alt={`${fullName}'s Profile Picture`}
                    className="rounded-full object-cover w-24 h-24 mx-auto mb-4"
                    style={{ width: '100px', height: '100px' }} />
                <div className="flex justify-between items-center w-full">
                    <CardTitle className="text-lg">
                        <span className="font-semibold text-gray-700">Name:</span> &nbsp; {fullName}
                    </CardTitle>
                    <CardTitle className="text-lg">
                        <span className="font-semibold text-gray-700">Age :  </span> &nbsp;{age}
                    </CardTitle>
                </div>
                <CardDescription className="w-full mt-1">
                    <span className="font-semibold text-gray-700">Species : </span> &nbsp;{species}
                </CardDescription>
                <CardDescription className="w-full mt-1">
                    <span className="font-semibold text-gray-700">Gender :  </span>  &nbsp;{gender}
                </CardDescription>
                <CardDescription className="w-full mt-1">
                    <span className="font-semibold text-gray-700">Breed :  </span> &nbsp; {breed}
                </CardDescription>

                {
                    adoptionStatus == "COMPLETED" && adopter ? 
                    <CardDescription className="w-full mt-1">
                        <span className="font-semibold text-green-600 font-bold">Owner :  &nbsp; {adopter.fullname}  </span>
                    </CardDescription> : ""
                }
                
            </CardHeader>

            <CardFooter className="flex-col gap-2">
                {
                    isAdmin ?
                        <div className="flex justify-end w-full space-x-2 pt-2 border-t border-gray-100">
                            {
                                !isAvailableForAdoption && adoptionStatus == "PENDING" ?
                                    <>
                                        <button
                                            onClick={onAllocateSucess}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                                            title="Edit Pet Details">
                                            Accept
                                        </button>
                                        <button
                                            onClick={onAllocateReject}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                                            title="Delete Pet">
                                            Reject
                                        </button>
                                    </> : null
                            }
                            <button
                                onClick={onEdit}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit Pet Details">
                                <Pencil className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete Pet"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        :
                        isAvailableForAdoption ?
                            <button
                                onClick={onRequest}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
                                Request
                            </button>
                            :
                            null
                }
            </CardFooter>
        </Card>
    );
}

export { ProfileCard };