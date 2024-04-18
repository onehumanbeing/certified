"use client"
interface DisplayCertificationProps {
    certificationName: string
    setCertificationName: React.Dispatch<React.SetStateAction<string>>
    note: string
    setNote: React.Dispatch<React.SetStateAction<string>>
    organizationName: string
    setOrganizationName: React.Dispatch<React.SetStateAction<string>>
}

const CreateCertification: React.FC<DisplayCertificationProps> = ({
    certificationName,
    setCertificationName,
    note,
    setNote,
    organizationName,
    setOrganizationName,
}) => {
    return (
        <div className="w-1/4 h-full flex flex-col gap-4">
            <label className="form-control">
                <div className="label">
                    <span className="label-text">Certification Name</span>
                </div>
                <textarea
                    value={certificationName}
                    onChange={(e) => setCertificationName(e.target.value)}
                    className="textarea textarea-bordered h-24"
                    placeholder="Project Management Institute"
                ></textarea>
                <div className="label"></div>
            </label>
            <label className="form-control">
                <div className="label">
                    <span className="label-text">Note</span>
                </div>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="textarea textarea-bordered h-24"
                    placeholder="Has been formally recognized for their knowledge ..."
                ></textarea>
                <div className="label"></div>
            </label>
            <label className="form-control">
                <div className="label">
                    <span className="label-text">Orgnization Name</span>
                </div>
                <textarea
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="textarea textarea-bordered h-24"
                    placeholder="University of California, Irvine"
                ></textarea>
                <div className="label"></div>
            </label>
        </div>
    )
}

export default CreateCertification
