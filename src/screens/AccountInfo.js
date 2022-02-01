import React, { useState, useEffect } from "react"
import { Table } from "react-bootstrap"
import MyNavbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { formatNearAmount } from "near-api-js/lib/utils/format"

function AccountInfo(props) {
  const [metaData, setMetaData] = useState({})

  useEffect(() => {
    async function getData() {
      let data = await window.account.state()
      console.log(data)
      setMetaData(data)
    }
    getData()
  }, [])

  return (
    <>
      <div className="font-sans w-100 flex flex-row h-100 items-center justify-start">
        {/* <Sidebar /> */}
        <div className="ml-0 md:ml-60 w-100 h-100 flex items-center justify-center bg-light">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow-md overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-600">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider "
                        >
                          Data
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                        >
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-indigo-50 divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {"Amount Near"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {parseInt(
                              formatNearAmount(metaData.amount)
                            ).toFixed()}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {"Block Hash"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {metaData.block_hash}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {"Code Hash"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {metaData.code_hash}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {"Storage Usage"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {metaData.storage_usage}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {"Storage Paid At"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {metaData.storage_paid_at}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountInfo

{
  /* <Table
          striped
          bordered
          hover
          size="sm"
          className="w-50 rounded-lg shadow-md overflow-hidden"
          bordered={true}
          variant="dark"
        >
          <tbody>
            <tr>
              <td>Amount</td>
              <td>{metaData.amount}</td>
            </tr>
            <tr>
              <td>Block Hash</td>
              <td>{metaData.block_hash}</td>
            </tr>
            <tr>
              <td>Block Height</td>
              <td>{metaData.block_height}</td>
            </tr>
            <tr>
              <td>Code Hash</td>
              <td>{metaData.code_hash}</td>
            </tr>
            <tr>
              <td>Storage Usage</td>
              <td>{metaData.storage_usage}</td>
            </tr>
            <tr>
              <td>Storage Paid At</td>
              <td>{metaData.storage_paid_at}</td>
            </tr>
          </tbody>
        </Table> */
}
