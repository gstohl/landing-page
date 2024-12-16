'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef } from "react"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setSubmitStatus('success')
      formRef.current?.reset()
    } catch (error) {
      console.error('Failed to submit form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Get in Touch</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Interested in collaborating or have a project in mind? Let&apos;s connect!
        </p>
      </div>
      <form ref={formRef} onSubmit={handleSubmit} className="mx-auto grid max-w-2xl gap-4">
        <Input 
          type="text" 
          name="name" 
          placeholder="Name" 
          required 
          disabled={isSubmitting}
        />
        <Input 
          type="email" 
          name="email" 
          placeholder="Email" 
          required 
          disabled={isSubmitting}
        />
        <Textarea 
          name="message" 
          placeholder="Message" 
          required 
          disabled={isSubmitting}
        />
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        {submitStatus === 'success' && (
          <p className="text-center text-green-600 dark:text-green-400">
            Message sent successfully!
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="text-center text-red-600 dark:text-red-400">
            Failed to send message. Please try again.
          </p>
        )}
      </form>
    </section>
  )
}

