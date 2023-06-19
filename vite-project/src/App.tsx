 import {useEffect, useState} from 'react';
import apiClient,{CanceledError, AxiosError} from './services/api-Client';
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
 import './App.css';

 interface User{
  id: number, 
  name: string
 }

function App() {

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(()=>{

    //effect cleanup
    const controller = new AbortController();

    setIsLoading(true)

    //get request
    apiClient.get<User[]>('/users', {signal: controller.signal})
    .then((response) =>{
      setUsers(response.data);
      setIsLoading(false);
  })
    .catch(error => {
      if(error instanceof CanceledError) return;
      toast((error as AxiosError).message);
     setIsLoading(false);
    })
    .finally(()=>{
      setIsLoading(false)
    })

    // best practice is to use finally to set isload how doesnt work with strict mode 

    return () => controller.abort();
  }, [])

  function deleteUser(user: User){
    setUsers(users.filter(u => u.id !== user.id)); // we pass the user object and we filter all users expect for the user with a given id

    // call the server to persist the changes
    apiClient.delete<User[]>('/users/'+user.id)
    .catch(error =>{
      toast(error.message);
      setUsers([...users]); //set the users back to original
    })
  }

  function addUser(){
    const newUser = {id: 0, name: 'John Doe ii'}
    setUsers([...users, newUser]);

     // pass the new user to the body, pass new user as a 2nd argument
     apiClient.post<User[]>('/users', newUser)
    .then( response => {
      setUsers([response.data,...users])
    })
    .catch((error) =>{
      toast(error.message);
      setUsers([...users])
    })

  }

  function editUser(user: User){
    const originalUsers = [...users];
    const updatedUser = {...user, name: user.name + '!!!'}

    //map through the users if the id of the current user match that of the supplied user id, 
    // update user otherwise return original user
    setUsers(users.map(u => u.id === user.id ? updatedUser : u ))

    // pass the updated user to the body of the request, we do this by passing it as a 2nd argument 
    apiClient.patch('https://jsonplaceholder.typicode.com/users/'+user.id, updatedUser)
    .catch(error => {
      toast(error.message);
      setUsers(originalUsers)
    })
  }
  return (
    <div>
    <ToastContainer />
    <button onClick={addUser} style={{background: 'green', color: 'white'}}>Add</button>

    {isLoading && <h1 style={{color: 'red'}}>is loading.....</h1>}
      {
        users.map((user)=>(
         <div style={{display: 'flex', justifyContent:'space-between', width: '500px'}}> 
          <p key={user.id} onClick={(id)=>{console.log(id)}}>{user.name}</p>
         <div>
          <button onClick={() => editUser(user)} style={{background: 'blue', color: 'white'}}>Edit</button>
          <button onClick={()=>deleteUser(user)} style={{background: 'red', color: 'white'}}>Delete</button>
          </div>
         </div>
      
        ))
        
      }
  </div>
  )
}

export default App
