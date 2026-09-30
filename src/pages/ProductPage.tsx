import { useParams } from 'react-router-dom'

export default function ProductPage() {
  const { id } = useParams()
  return <h1 className="text-2xl font-bold">Produkt {id}</h1>
}