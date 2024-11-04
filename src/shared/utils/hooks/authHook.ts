import { useState, useEffect } from 'react';
import { Users } from '../../entities/User/user';
import CookieManager from '../cookieManager';


export default function useAuth(){
        const [user,setUser] = useState<Users>();
        const [isLoading,setisLoading] = useState<boolean>(true);

        useEffect(() => {
            if(typeof window !== undefined){
                // const stringy = sessionStorage.getItem("user");
                const stringy = CookieManager.getCookie("user");
                if(stringy){
                    setisLoading(false);
                    setUser(JSON.parse(stringy as string));
                }else{
                    setisLoading(false);
                    return undefined;
                }
            }   
        }, [])

        return {user,isLoading};
}