import React from "react"

function News(props) {
  return (
    <div className="w-100 h-28 bg-gray-100 rounded-lg flex flex-row items-center p-2 shadow-md">
      <img className="aspect-square h-5/6 rounded-md" src={props.imageUrl} />
      <div className="font-bold flex flex-row items-start justify-start h-5/6 w-100 ml-3 text-sm">
        {props.text}
      </div>
    </div>
  )
}

export default News
