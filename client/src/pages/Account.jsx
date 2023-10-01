import { useAuth } from '../components/AuthProvider';
import axios from 'axios';

function Account() {
    const {user} = useAuth();

    return (
        <div className="flex justify-center items-center">
            <main>
                
            </main>
        </div>
    )
}

export default Account