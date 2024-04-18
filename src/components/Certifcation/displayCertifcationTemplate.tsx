"use client"

interface DisplayCertificationTemplateProps {
    certificationName: string
    note: string
    organizationName: string
}

const DisplayCertificationTemplate: React.FC<DisplayCertificationTemplateProps> = ({
    certificationName,
    note,
    organizationName,
}) => {
    return (
        <div className="bg-white p-10 rounded-lg shadow-xl text-center h-full w-full flex flex-col justify-center align-middle">
            <div className="mb-4">
                <div className="flex justify-center"></div>
                <h2 className="text-3xl font-bold text-blue-900">
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
                        <p className="text-sm text-gray-900">
                            {organizationName
                                ? organizationName
                                : "University of California, Irvine"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Date:</p>
                        <p className="text-sm text-gray-900">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayCertificationTemplate
