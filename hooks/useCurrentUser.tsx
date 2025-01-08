import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../app/actions";

export default function useCurrentUser() {
    const {data, isFetching} = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        retry: false,
        refetchInterval: 180000
    })

    return {data, isFetching}
}