import {
  type PaginationState
} from "@tanstack/react-table"
import { Button } from "../../components/ui/button"
import { useMemo, useState } from "react"
import { useDeleteMutation, usestatusAllocateUpdateMutation, useStatusUpdateMutation } from "../../services/mutation/pet"
import { toast } from "sonner"
import { Skeleton } from "../../components/ui/skeleton"
import { useNavigate } from "@tanstack/react-router"
import { Route } from "../../routes/_home/pets"
import { useGetPets } from "../../services/queries/pet"
import { ProfileCard } from "../../components/ui/profile-card"
import { USERTYPE  } from "../../schema/user"

export function PetList() {

  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem('auth'));
  const isAdmin = !!(auth && auth?.usertype === USERTYPE.ADMIN);  

  const { page, limit } = Route.useSearch();

  const pagination = useMemo<PaginationState>(() => ({
    pageIndex: page,
    pageSize: limit,
  }), [page, limit]);

  const [searchTerm, setSearchTerm] = useState("");

  const { data: petData, isPending } = useGetPets(searchTerm, pagination)

  const deleteMutation = useDeleteMutation();
  const statusUpdateMutation = useStatusUpdateMutation();
  const statusAllocateUpdateMutation = usestatusAllocateUpdateMutation();

  const goToPage = (pageNumber: number) => {
    navigate({
      to: '/pets',
      search: {
        page: pageNumber,
        limit: pagination.pageSize,
      },
      replace: true,
    });
  }


  const changePageSize = (newPageSize: number) => {
    navigate({
      to: '/pets',
      search: {
        page: 1,
        limit: newPageSize,
      },
      replace: true,
    });
  }

  const onEdit = async (raw: Pet) => {
    navigate({
      to: '/pet/$id',
      params: { id: `${raw.id}` }
    })
  }

  const onDelete = async (raw: Pet) => {
    try {
      deleteMutation.mutate({ id: raw.id }, {
        onSuccess: () => {
          toast.success("Pet deleted successfully.")
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
          toast.error(msg)
        }
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
    }
  }

  
  const onAllocate = async (raw: Pet , petStatus : string) => {
    try {
      const payLoad = {
        petId : raw.id,
        petstatus : petStatus,
      };
       
      statusAllocateUpdateMutation.mutate({ body : payLoad }, {
        onSuccess: (response) => {
          toast.success(response.message)
        },
        onError: (error: any) => {
          console.log("error",error); 
          const msg = 'Something went wrong'
          toast.error(msg)
        }
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
    }
  }

  const onRequest = async (raw: Pet) => {
    try {      
       

      const payLoad = {
        userId : auth.user,
        petId : raw.id,
        petstatus : "REQUEST",
      };
 
      
 
      statusUpdateMutation.mutate({ body : payLoad }, {
        onSuccess: (response) => {
          toast.success(response.message)
        },
        onError: (error: any) => {
          console.log("error",error); 
          const msg = 'Something went wrong'
          toast.error(msg)
        }
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
    }
  }

  function debounce(func: any) {
    let timeoutId: any;

    return function (inputValue: any) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(inputValue);
      }, 1000)
    }
  }

  const debouncedSearch = debounce((value: any) => {
    setSearchTerm(value);
  })


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

  const hasData = petData?.data && petData?.data?.length > 0;

  return (
    <div className="w-full">
      <div className="flex justify-end items-center my-2">
        <input
          type="text"
          placeholder="Search student..."
          className="border rounded p-2 w-1/5 mr-4"
          onChange={(e) => {
            debouncedSearch(e.target.value);
          }}
        />
        { 
            isAdmin ? 
            <Button variant="outline" onClick={() => {
              navigate({
                to: '/pet/$id',
                params: { id: 'new' }
              });
            }}>
              New
            </Button>
        : null }
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {hasData ?
              <>
                {petData?.data.map((pets: any) => {
                  return <ProfileCard
                    key={pets.id}
                    age={pets.ageYears}
                    picture={pets.picture}
                    adoptionStatus={pets.adoptionStatus}
                    breed={pets.breed}
                    fullName={pets.fullname}
                    adopter={pets.adopter}
                    gender={pets.gender}
                    isAvailableForAdoption={pets.isAvailableForAdoption}
                    species={pets.species}
                    onDelete={()=>{onDelete(pets) }}
                    onEdit={()=>{onEdit(pets)}}
                    onRequest={()=>{onRequest(pets)}}
                    onAllocateSucess={()=>{onAllocate(pets, "COMPLETED")}}
                    onAllocateReject={()=>{onAllocate(pets, "REJECTED")}}
                    isAdmin={isAdmin}
                  />
                })}
              </> : null
            }
          </div>
        </div>
      </div>

      {hasData ?
        <div className="flex justify-end py-2" >
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => goToPage(1)}
              disabled={page == 1}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => goToPage(page - 1)}
              disabled={page == 1}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => goToPage(page + 1)}
              disabled={!petData?.pagination?.hasNext}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => goToPage(petData?.pagination.totalPages || 1)}
              disabled={!petData?.pagination?.hasNext}>
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {page} of{' '}
                {petData?.pagination?.totalPages || 1}
              </strong>
            </span>
            <select
              value={limit}
              onChange={e => {
                changePageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>            
          </div>
        </div>
        : null
      }

    </div>
  )

}

export type Pet = {
  id: number
  ageYears: number
  fullname: string
  picture: { id: string, url: string }
  description: string
  status?: string
  createdAt: Date
  updatedAt: Date
} 