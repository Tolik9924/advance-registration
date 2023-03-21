import { observer } from 'mobx-react-lite';
import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from './components/LoginForm';
import { Context } from './index';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, [store]);

    const getUsers = async () => {
        try {
            console.log('function works');
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    if (store.isLoading) {
        return <div>Loading...</div>;
    }

    if (!store.isAuth) {
        return (
            <LoginForm />
        );
    }

    return (
        <div className="App">
            <h1>{store.isAuth ? `User authorized ${store.user.email}` : 'AUTHORIZED'}</h1>
            <h1>{store.user.isActivated ? 'Account is activated' : 'Activate account please!'}</h1>
            <button onClick={() => store.logout()}>Logout</button>
            <div>
                <button onClick={() => getUsers()}>Get users</button>
            </div>
            {users.map(user => {
                return <div key={user.email}>{user.email}</div>
            })}
        </div>
    );
}

export default observer(App);
