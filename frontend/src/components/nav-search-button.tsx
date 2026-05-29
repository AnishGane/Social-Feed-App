import { openSearch } from "@/features/search/search-slice";
import { useAppDispatch } from "@/hooks";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "./ui/kbd";

const NavSearchButton = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="flex w-full max-w-xs flex-col gap-6">
            <InputGroup onClick={() => dispatch(openSearch())}>
                <InputGroupInput placeholder="search by username or name" />
                <InputGroupAddon align="inline-end">
                    <Kbd>Ctrl</Kbd>
                    <Kbd>K</Kbd>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}


export default NavSearchButton;