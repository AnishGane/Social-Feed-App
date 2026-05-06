import { Button } from "@/components/ui/button"
import { useLogoutApiMutation } from "@/services/auth-api"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DashboardPage = () => {
    const [logoutApi, { isLoading }] = useLogoutApiMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
            toast.success("Logout successful.");

            navigate("/auth", { replace: true });
        } catch (error) {
            const message = (error as any)?.data?.message || (error as Error)?.message || "Logout failed. Please try again.";
            toast.error(message);
        }
    }

    return (
        <div>
            <Button onClick={handleLogout} disabled={isLoading}>Logout</Button>
        </div>
    )
}

export default DashboardPage