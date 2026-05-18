import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button"
import { useLogoutApiMutation } from "@/services/auth-api"
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {

    const [logoutApi, { isLoading }] = useLogoutApiMutation();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const res = await logoutApi().unwrap();
            if (res.success) {
                navigate("/auth", { replace: true });
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <Button onClick={handleLogout}>
                {isLoading ? "Logging out..." : "Logout"}
            </Button>
            <ModeToggle />
        </>
    )
}

export default SettingsPage