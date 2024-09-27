import React from 'react'

function DocsNotFound() {
    return ( 
        <React.Fragment>
            <div className="mx-auto container text-center w-1/2">
                <div className="flex flex-row gap-3 mb-10 py-2">
                    <img src="/docs.png" className='w-10' alt="" />
                    <p className='text-left my-auto text-2xl font-serif font-bold text-gray-400'>Docx</p>
                </div>
                <h3 className="font-bold text-xl mb-6">
                Sorry, the file you have requested does not exist.
                </h3>
                <h5>Make sure that you have the correct URL and the file exists.</h5>
                <div className="border-2 border-black p-8 mt-10 bg-sea-100">
                    <h4 className='font-bold text-lg mb-5'>Get stuff done with Docx</h4>
                    <p>Apps in Docx make it easy to create, store and share online documents, spreadsheets, presentations and more.
                    </p>
                </div>
            </div>
        </React.Fragment>
     );
}

export default DocsNotFound;