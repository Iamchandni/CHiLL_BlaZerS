import react from 'react'
import react from 'react-dom'
import user from '../routes/users'
function search(){
   const [Query,setQuery] = useState("")
   let arr=work.filter((user)=>user.username.toLowerCase().includes(Query))
   if (arr.length()<7){
    arr=work.filter((user)=>user.username.toLowerCase().includes(Query)).slice(-arr.length(),-1)
   }else{
    arr=work.filter((user)=>user.username.toLowerCase().includes(Query)).slice(-6,-1)
   }
   return(
    <div>
    <input id="searchbar" type="text"
            name="search" placeholder="Search animals.." style="width:calc(100%/1.5);border-radius: 20px;padding-inline: 20px;margin-block: 5px;" onChange={(e)=>setQuery(e.target.value)}/>
            <ul >
                {arr.map((user)=>(
                <button >
                  {user.username}  </button>))}
            </ul>
</div>
   )
 }
 const root=document.getElementById('root')
 ReactDOM.render(<search/>,root)