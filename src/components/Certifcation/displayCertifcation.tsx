"use client"

import Image from "next/image"

interface DisplayCertificationProps {
    certificationName: string
    note: string
    organizationName: string
}

const DisplayCertification: React.FC<DisplayCertificationProps> = ({
    certificationName,
    note,
    organizationName,
}) => {
    return (
        <div className="bg-white p-20 rounded-lg shadow-lg text-center h-auto flex flex-col justify-center align-middle relative w-[670px] cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
            <div className="mb-4">
                <div className="flex justify-center"></div>
                <h2 className="text-3xl font-bold text-blue-900 whitespace-pre">
                    {certificationName ? certificationName : "Project Management Institute"}
                </h2>
            </div>

            <div className="mb-8">
                <h1 className="text-4xl text-gray-700">xxx xxxx</h1>
                <div className="mt-2 mb-4 h-1 bg-blue-300 mx-auto w-36"></div>
                <p className="text-gray-600 px-16 py-2">
                    {note
                        ? note
                        : "Through this achievement, has demonstrated a commitment to professional development and has acquired valuable skills that are essential for effective project management in a variety of professional settings."}
                </p>
            </div>

            <div className="text-left">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Given by:</p>
                        <p className="text-lg text-gray-900 font-whisper font-bold">
                            {organizationName
                                ? organizationName
                                : "University of California, Irvine"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Issued Date:</p>
                        <p className="text-sm text-gray-900">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-5 right-5">
                <Image
                    className="w-[90px] h-auto  "
                    src="/assets/certified_logo.png"
                    width={549}
                    height={201}
                    alt="the certified logo"
                    priority
                />
                <p className="text-[6px]">https://www.thecertified.xyz/</p>
            </div>
        </div>
    )
}

export default DisplayCertification
