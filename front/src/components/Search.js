import React, { useEffect, useState } from 'react';
import './Search.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';



import search_icon from "./icon.png"

const Search = (props) => {
    const [currdata, setcurrdata] = useState([])
    const [filter, setfilter] = useState('')
    const [enteredSearch, setenteredSearch] = useState('');
    const [data, setData] = useState([]);
    const [relFeedback, setRelFeedback] = useState([])
    const [nonRelFeedback, setNonRelFeedback] = useState([])
    const [precisions, setPrecisions] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [totalRel, setTotalRel] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [rel_ids, setrel_ids] = useState([])
    const [nonrel_ids, setnonrel_ids] = useState([])
    const [currPage, setCurrPage] = useState(1);
    const [query, setquery] = useState('')
    const [loadingval, setloadingval] = useState("Enter a Query")
    const [load, setload] = useState(false)
    const SearchChangeHandler = (event) => {
        setenteredSearch(event.target.value);
    };
    useEffect(() => {
        const doit=async()=>{if(localStorage.getItem(enteredSearch)===null){
            fetch('http://127.0.0.1:8000/search/', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "entered_query": enteredSearch
                })
            }).then(res => res.json()).then(data =>{
                console.log(data.data)
                if(data.data.length===0){
                    setloadingval("No Results Found. Try searching a different query")
                }
                setData(data.data)
                setcurrdata(data.data)
            });
        }
        else{
            const items = JSON.parse(localStorage.getItem(enteredSearch));
            setrel_ids(items.rel_ids)
            setnonrel_ids(items.nonrel_ids)
            await fetch('http://127.0.0.1:8000/feedback/', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "entered_query": enteredSearch,
                    "rel_ids":items.rel_ids,
                    "nonrel_ids":items.nonrel_ids,
                    "choice":1
                })
            }).then(res => res.json()).then(data =>{
                console.log("first")
                console.log(data.data)
                if(data.data.length===0){
                    setloadingval("No Results Found. Try searching a different query")
                }
                setData(data.data)
                setcurrdata(data.data)
            }
            );
            
        }}
        doit()
        
    }, [load])
    

    const SearchHandler = async (event) => {
        event.preventDefault();
        console.log(enteredSearch)
        if(query!=''){
            localStorage.removeItem(query)
            localStorage.setItem(query,JSON.stringify({"rel_ids":rel_ids,"nonrel_ids":nonrel_ids}))
            setnonrel_ids([])
            setrel_ids([])
        }
        setquery(enteredSearch)
        
        setPrecisions([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        setTotalRel([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    
    
        const SearchedData = {
            search: enteredSearch,
        };

        console.log(SearchedData);
        if(load===false)
            setload(true)
        else{
            setload(false)
        }
        setData([])
        setloadingval("Getting Results....................")
    }

    // console.log(relFeedback)
    // console.log(nonRelFeedback)

    const addRel = async(id, index) => {
        // let temp = relFeedback
        // temp.push(id)
        // if(nonrel_ids.includes(id)){
        //     const indc = array.indexOf(5);
        //     if (indc > -1) { // only splice array when item is found
        //         array.splice(index, 1); // 2nd parameter means remove one item only
        //     }
        // }
        if(!rel_ids.includes(id))
            setrel_ids(rel_ids.concat(id))
        console.log(id)
        console.log(rel_ids.concat(id))
        // await fetch('http://127.0.0.1:8000/feedback/', {
        //     method: 'post',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         "entered_query": enteredSearch,
        //         "rel_ids":rel_ids.concat(id),
        //         "nonrel_ids":nonrel_ids,
        //         "choice":1
        //     })
        // }).then(res => res.json()).then(data =>{
        //     console.log("first")
        //     console.log(data.data)

        //     setData(data.data)}
        // );
        setRelFeedback([...relFeedback, id])
        // console.log(relFeedback);
        let rels = totalRel
        for (let i = index; i < 15; i++) {
            if (rels[i] >= i + 1) {
                rels[i] = i + 1
                break;
            }
            else rels[i] += 1
        }
        setTotalRel(rels)
        // console.log(rels);
        let temp = []
        for (let i = 0; i < 15; i++) {
            let prec = rels[i] / (i + 1)
            temp.push(prec);
        }

        // console.log(temp);

        setPrecisions(temp)
    }

    const addNonRel = (id, index) => {
        if(!nonrel_ids.includes(id))
            setnonrel_ids(nonrel_ids.concat(id))
        // let temp = nonRelFeedback
        // temp.push(id)
        // if(!nonrel_ids.includes(id))
        //     setnonrel_ids(nonrel_ids.concat(id))
        // fetch('http://127.0.0.1:8000/feedback/', {
        //     method: 'post',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         "entered_query": enteredSearch,
        //         "rel_ids":rel_ids,
        //         "nonrel_ids":nonrel_ids,
        //         "choice":1
        //     })
        // }).then(res => res.json()).then(data =>{
        //     console.log(data.data)
        //     setData(data.data)}
        // );
        let rels = totalRel
        for (let i = index; i < 15; i++) {
            if (rels[i] === 0) rels[i] = 0;
            else rels[i] -= 1
        }
        setTotalRel(rels)

        let temp = []
        for (let i = 0; i < 15; i++) {
            let prec = rels[i] / (i + 1)
            temp.push(prec);
        }
        setPrecisions(temp)
        setNonRelFeedback([...nonRelFeedback, id])
    }
    console.log(currPage)
    const handlefilterchange=(e)=> {
      setfilter(e.target.value)
      if(e.target.value!==''){
        console.log("inside first")
        const f=currdata.filter((x)=>{return x[0][3]===e.target.value })
        console.log("f is"+f.length)
        if(f.length===0){
            setloadingval("No matching Results")
        }
        setData(f)
      }
      else{
        
        setData(currdata)
      }
    }
    
    return (
        <div >
            <div className="contain-heading "><h1 className='heading '>Blog Search</h1></div>
            <div className='contain'>

            <form onSubmit={SearchHandler} className='search-bar'>
                <input type="text" id="search" placeholder="Search for..." value={enteredSearch} onChange={SearchChangeHandler} required/>
                <button type='submit' className = {"search_icon"}><img src={search_icon} /></button>
                    
                    {/* <label htmlFor="Search">Search Your Query Here</label><br />

                <input type="text" id="Search" name="Search" value={enteredSearch} onChange={SearchChangeHandler} />
                <br /> */}

                    {/* <div>
                    <button type='Search'>Search</button>
                </div> */}
                
            </form>
            <div className="btn-group mx-5">
                <select className="form-select" aria-label="Default select example" value={filter} onChange={handlefilterchange}>
                    <option value='' selected>Topic</option>
                    <option value="Student">Student</option>
                    <option value="Banking">Banking</option>
                    <option value="Non-Profit">Non-Profit</option>
                    <option value="InvestmentBanking">InvestmentBanking</option>
                    <option value="indUnk">indUnk</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Technology">Technology</option>
                </select>
            </div>
            </div>
            {/* {console.log(data.data)} */}
            {data.length===0 && <div className='container mt-5 mb-5' style={{"textAlign":"center","color":"darkblue"}}><b> {loadingval} </b></div>}
            
                
            {
                data.map((d,idx) => {
                    // console.log(idx)
                    if (idx>=((currPage-1)*10) && idx<(currPage*10))
                    return (
                        <Card totalRel={totalRel} precisions={precisions} index={idx} key={d.id} d={d} addRel={addRel} addNonRel={addNonRel} />
                    )
                    // console.log(d);
                })
            }
            
            <Stack alignItems="center">
            <Pagination className='pagination' count={Math.ceil(data.length/10)} onChange={(e,p)=>setCurrPage(p)} showFirstButton showLastButton />
            </Stack>
        </div>
    );
};

function Card(props) {

    // const d = props.d
    const [bgcol, setbgcol] = useState('rgb(87, 171, 171)')

    const addRel = () => {
        setbgcol('green')
        props.addRel(props.d[1], props.index);
    };

    const addNonRel = () => {
        setbgcol('red')
        props.addNonRel(props.d[1], props.index);
    };
    console.log(props.d)
    return (
        <div>
            <div className='abc m-4 px-4' style={{"backgroundColor":bgcol,"borderRadius":"25px"}}>
                <hr />
                <h3 className=''>{props.d[0][3]}</h3>
                <h4>{props.d[0][5]}</h4>
                <h6>{props.d[0][6]}</h6>
                <button onClick={addRel} className='rel'>Relevant</button>
                <button onClick={addNonRel} className='Non-rel'>Non Relevant</button>

                <hr />
                <div className='pb-4' style={{}}>
                    <h4>Precision : {props.precisions[props.index]}</h4>
                </div>
            </div>
            
        </div>
    )
}

export default Search;

