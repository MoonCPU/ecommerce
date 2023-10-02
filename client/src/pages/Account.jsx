import { useAuth } from '../components/AuthProvider';
import { useEffect } from 'react';
// import axios from 'axios';

function Account() {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            console.log('logged in');
        } else {
            console.log('failed');
        }
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto flex flex-col">
            <main>
                <div>
                    {user && user.user_name}
                </div>
            </main>
            <section>

            </section>
        </div>
    );
}

export default Account;
