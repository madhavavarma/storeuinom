import { Fragment, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Header from "@/components/base/Header"

const components2: { title: string; href: string; description: string }[] = [
  {
    title: "How can I contact customer support?",
    href: "/#/faq",
    description:
      "You can reach our support team via email at support@example.com or call us at +91 98765 43210.",
  },
  {
    title: "What payment methods do you accept?",
    href: "/#/faq",
    description:
      "We accept credit/debit cards, UPI, net banking, and wallets.",
  },
  {
    title: "How can I track my order?",
    href: "/#/faq",
    description:
      "You can track your order from the 'My Orders' section after logging in.",
  },
  {
    title: "What is your return policy?",
    href: "/#/faq",
    description:
      "We offer a 7-day return policy for most products. Check the return policy on the product page for details.",
  },
  {
    title: "Do you offer cash on delivery (COD)?",
    href: "/#/faq",
    description:
      "Yes, COD is available for select locations. Check availability at checkout.",
  },
  {
    title: "How long does delivery take?",
    href: "/#/faq",
    description:
      "Standard delivery takes 3-5 business days, while express delivery takes 1-2 days.",
  },
  {
    title: "Can I change my delivery address?",
    href: "/#/faq",
    description:
      "Yes, you can change your address before the order is shipped by visiting the 'My Orders' section.",
  },
  {
    title: "Do you ship internationally?",
    href: "/#/faq",
    description:
      "Currently, we only ship within India. Stay tuned for international shipping options.",
  },
  {
    title: "Is my payment information secure?",
    href: "/#/faq",
    description:
      "Absolutely. We use SSL encryption and secure payment gateways to protect your data.",
  },
]

export default function FAQPage() {
  const [query, setQuery] = useState("")

  const filteredFaqs = components2.filter((faq) =>
    faq.title.toLowerCase().includes(query.toLowerCase()) ||
    faq.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Fragment>
        <Header></Header>
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Heading */}
        <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-green-700"
        >
            Frequently Asked Questions
        </motion.h1>

        {/* Search */}
        <div className="max-w-md mx-auto">
            <Input
            type="text"
            placeholder="Search FAQs..."
            className="border border-gray-300 rounded-md px-4 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
        </div>

        {/* FAQ Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
            {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
                <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                >
                <Card className="h-full">
                    <CardContent className="p-4 space-y-2">
                    <h2 className="text-lg font-semibold text-green-800">
                        {faq.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {faq.description}
                    </p>
                    </CardContent>
                </Card>
                </motion.div>
            ))
            ) : (
            <p className="text-center col-span-2 text-muted-foreground">
                No FAQs matched your search.
            </p>
            )}
        </div>
        </div>
  {/* Footer removed for centralized layout */}
    </Fragment>
  )
}
