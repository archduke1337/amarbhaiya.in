/**
 * @fileoverview Payment detail — transaction info, refund actions.
 */
type Props = { params: Promise<{ id: string }> }

export default async function AdminPaymentDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payment Detail</h1>
      <p className="text-muted-foreground mb-4">Payment ID: {id}</p>
      {/* TODO: PaymentDetailCard, RefundButton */}
    </div>
  )
}
