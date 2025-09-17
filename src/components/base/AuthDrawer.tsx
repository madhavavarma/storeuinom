import RightDrawer from "../pages/Shared/RightDrawer";
import SupabaseAuth from "./SupabaseAuth";

const AuthDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <RightDrawer isOpen={open} onClose={onClose} title="User Login">
      <SupabaseAuth onAuthSuccess={onClose} />
    </RightDrawer>
  );
};

export default AuthDrawer;
