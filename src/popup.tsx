import { useEffect, useState } from "react"

import "./style.css"

function IndexPopup() {
  const [data, setData] = useState("")
  const [selectText, setSelectText] = useState("")
  const [transSelectText, setTransSelectText] = useState("")
  const [translateInputVal, setTranslateInputVal] = useState("")
  const [type, setType] = useState("select")
  console.log(chrome)

  // 监听插件图标点击事件
  // chrome.action.onClicked.addListener(() => {
  //   console.log("onClicked")
  // })
  function translateSelectText() {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getSelectText" }, (res) => {
        console.log("content-->popup", res)
        const { to, from } = res
        if (!to) {
          setType("input")
        }
        setSelectText(from)
        setTransSelectText(to)
      })
    })
  }
  useEffect(() => {
    console.log(chrome)
    setTimeout(() => {
      translateSelectText()
    }, 1000)
  }, [])

  async function onInputTranslate() {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {}, (_) => {
        // const res = await youdaoTrans(data)
        // setTranslateInputVal(res)
      })
    })
  }

  function handleCopy(text) {
    text && navigator.clipboard.writeText(text)
  }
  return (
    <div className="w-80 text-center flex flex-col justify-between bg-red-200 p-3 ">
      {type === "select" && (
        <div className="w-full h-full">
          <div className="text-left">
            <span className="text-base">翻译已选文字的结果：</span>
          </div>
          <p className="m-5 h-60 bg-white text-base text-left">
            {transSelectText}
          </p>
          <div className="flex justify-around">
            <button
              className="btn-primary bg-blue-400"
              onClick={() => setType("input")}>
              输入翻译
            </button>
            <button
              className="btn-primary bg-green-400"
              onClick={() => handleCopy(transSelectText)}>
              复制结果
            </button>
          </div>
        </div>
      )}
      {type === "input" && (
        <div className="w-full h-full">
          <div className="text-left mb-5">
            <span className="text-base">手动输入：</span>
          </div>
          <textarea
            style={{ width: "87%" }}
            className="text-base "
            onChange={(e) => setData(e.target.value)}
            value={data}
            rows={3}
            placeholder="输入要翻译的内容"
          />
          <div className="m-5 h-60 bg-white text-base  text-left">
            {translateInputVal}
          </div>
          <div className="flex justify-around">
            <button className="btn-primary" onClick={() => onInputTranslate()}>
              翻译
            </button>
            <button className="btn-primary">复制</button>
          </div>
        </div>
      )}

      <a href="https://docs.plasmo.com" target="_blank" className="text-right">
        power by plasmo
      </a>
    </div>
  )
}

export default IndexPopup
