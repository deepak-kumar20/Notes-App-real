import { Card, CardContent } from "@/components/ui/card"

export function WelcomeCard({
  name,
  emailMasked,
}: {
  name: string
  emailMasked: string
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <p className="font-semibold">Welcome, {name} !</p>
        <p className="text-sm text-muted-foreground mt-1">Email: {emailMasked}</p>
      </CardContent>
    </Card>
  )
}
