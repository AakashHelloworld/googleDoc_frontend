import React, { useEffect, useState } from 'react'
import style from "../../Styles/Doc.module.css"
import {BiDotsVerticalRounded} from "react-icons/bi"
import axios from 'axios'
import {ImCross} from "react-icons/im"
import { Link } from 'react-router-dom'
import Modal from '../../FormAndModal/Modal'

const Blank =({data,DeleteDoc,shared})=>{
  const [popupStatus, SetpopupStatus] = useState(false);

  const popupHandler = () =>{
    SetpopupStatus(!popupStatus)
  }

  const deleteHandler = ()=>{
    DeleteDoc(data._id)
    SetpopupStatus(!popupStatus)
  }

  

  return(
        <div key={data._id} className={style.doc}>
        <div className={style.docFirst}>
        </div>
        <div className={style.docSecond}>
          <div className={style.docDetail}>
          <Link to={`/doc/${data._id}/${shared}`}>
          <p>{data.Title}</p>
          <div>
          <img src='https://cdn-icons-png.flaticon.com/512/5968/5968517.png' />
          <span>opened:{data.CreatedAt}</span>
          </div>
          </Link>
          { !shared &&
          <div          
className={style.iconcontainer} onClick={popupHandler}>
            <BiDotsVerticalRounded className={style.icon}/>
          </div>
          }
          </div>
        </div>
              <Modal isOpen={popupStatus}> 
                      <div className={style.modalContainer}>
                          <div className={style.iconContainer}><ImCross onClick={popupHandler} /></div>
                          <ul>
                            <li >Rename</li>
                            <li onClick={deleteHandler}>Delete</li>
                          </ul>
                      </div>
              </Modal>
        </div>

  )


}









export default function AllDoc({userId}) {
    const [AllDoc, setAllDoc] = useState([]);
    const [SharedDoc, setSharedDoc] = useState([]);
  useEffect(()=>{
    fetchDoc()
    sharedDoc()
  },[])

    const DeleteDoc = (DocId)=>{
      axios.delete(`http://localhost:4000/api/docs/delete/${DocId}/${userId}`).then((result)=>{

        if(result?.data?.Docs?.length)
        {

        const Arr = result.data.Docs
        const finalArr = Arr.map((data)=>{

          let date = new Date(data.CreatedAt);
          let options = { year: 'numeric', month: 'short', day: 'numeric' };
          let formattedDate = date.toLocaleDateString('en-US', options);
          return {...data, CreatedAt:formattedDate}
        })
        setAllDoc(finalArr)
      }

      }).catch((err)=>{
        console.log(err)
      })

    }

    const fetchDoc = async()=>{
        await axios.get(`http://localhost:4000/api/docs/all/${userId}`).then((result)=>{

            if(result?.data?.Docs?.length)
            {

            const Arr = result.data.Docs
            const finalArr = Arr.map((data)=>{

              let date = new Date(data.CreatedAt);
              let options = { year: 'numeric', month: 'short', day: 'numeric' };
              let formattedDate = date.toLocaleDateString('en-US', options);
              return {...data, CreatedAt:formattedDate}
            })
            setAllDoc(finalArr)
          }

        }).catch((err)=>{
          console.log(err)
        })
    }

    const sharedDoc = async()=>{
      await axios .get(`http://localhost:4000/api/docs/shared/${userId}`).then((result)=>{
        if(result?.data?.Docs?.length)
        {

        const Arr = result.data.Docs
        const finalArr = Arr.map((data)=>{

          let date = new Date(data.CreatedAt);
          let options = { year: 'numeric', month: 'short', day: 'numeric' };
          let formattedDate = date.toLocaleDateString('en-US', options);
          return {...data, CreatedAt:formattedDate}
        })
        setSharedDoc(finalArr)
      }
      }).catch((err)=>{
        console.log(err)
      })
    }







  return (
    <div className={style.AllDocContainer}>
    <div className={style.SubContainer}>

    <div className={style.CreateText}>
        <span>Shared documents</span>
    </div>

    <div className={style.DocSubContainer}>
    {  !!SharedDoc?.length&& SharedDoc.map((data)=>{
      return(  
        <Blank key={data._id} data={data} DeleteDoc={DeleteDoc} shared={true}/>
        )
        } )
    }
    </div>


    <div className={style.CreateText}>
        <span>Recent documents</span>
    </div>
    <div className={style.DocSubContainer}>


    {  !!AllDoc?.length&& AllDoc.map((data)=>{
      return(  
        <Blank key={data._id} data={data} DeleteDoc={DeleteDoc} shared={false} />
        )
        } )
    }
    </div>
    </div>
    </div>
  )
}
