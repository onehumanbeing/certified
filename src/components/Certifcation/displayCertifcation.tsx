"use client"

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
        <div className="bg-white p-10 rounded-lg shadow-xl text-center h-full w-full flex flex-col justify-center align-middle">
            <div className="mb-4">
                <div className="flex justify-center"></div>
                <h2 className="text-3xl font-bold text-blue-900">Certificate of Completion</h2>
            </div>

            <div className="mb-8">
                <h1 className="text-4xl text-gray-700">John Doe</h1>
                <div className="mt-2 mb-4 h-1 bg-blue-300 mx-auto w-24"></div>
                <p className="text-gray-600">
                    For successfully completing the digital marketing program
                </p>
            </div>

            <div className="text-left">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Given by:</p>
                        <p className="text-sm text-gray-900">Jane Smith</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Date:</p>
                        <p className="text-sm text-gray-900">2/22/22</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayCertification
