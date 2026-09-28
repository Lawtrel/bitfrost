import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardTitle?: React.ReactNode
  cardSubtitle?: React.ReactNode
  cardDescription?: React.ReactNode
  cardIcon?: React.ReactNode
  cardFooter?: React.ReactNode
  headerClassName?: string
  titleClassName?: string
  subtitleClassName?: string
  descriptionClassName?: string
  iconClassName?: string
  footerClassName?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, headerClassName, titleClassName, subtitleClassName, descriptionClassName, iconClassName, footerClassName, cardTitle, cardSubtitle, cardDescription, cardIcon, cardFooter, children, ...props }: CardProps, ref) => (
  <div data-testid="card" ref={ref} className={cn("rounded-lg border group shadow-md", className )} {...props}>
      {(cardIcon || cardTitle || cardSubtitle || cardDescription) && (
        <header data-testid="card-header" className={cn("flex flex-col items-start gap-8 ml-5", headerClassName)}>
          <div className="flex mt-5 gap-4 items-center w-full">
            {cardIcon && (
              <div className={cn("rounded-lg border bg-black bg-opacity-50 group-hover:bg-white flex items-center justify-center text-card-foreground shadow-sm", iconClassName)} >
                {cardIcon}
              </div>
            )}
            {cardTitle && (
              <h3 className={cn("text-2xl font-semibold leading-none tracking-tight font-inter", titleClassName)}>
                {cardTitle}
              </h3>
            )}
          </div>
            {cardSubtitle && (
              <h4 className={cn("text-2xl font-semibold leading-none tracking-tight font-inter", subtitleClassName)}>
                {cardSubtitle}
              </h4>
            )}
            <div>
              {cardDescription && (
                <p className={cn("text-md text-white w-[240px]", descriptionClassName)}>
                  {cardDescription}
                </p>
              )}
            </div>
        </header>
      )}
      {children}
      {cardFooter && (
        <footer data-testid="card-footer" className={cn("flex items-center p-6 pt-0", footerClassName)}>
          {cardFooter}
        </footer>
      )}  
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
