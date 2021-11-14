import { useNavigate, useSearchParams } from "react-router-dom"
import { Modal } from "../ui/Modal"

export function SearchParamModal({
  title,
  paramName,
  children,
}: {
  title: string
  paramName: string
  children: React.ReactNode
}) {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  return (
    <Modal
      title={title}
      open={params.has(paramName)}
      onClose={() => navigate(-1)}
    >
      {children}
    </Modal>
  )
}
