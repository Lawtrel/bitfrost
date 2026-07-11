import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardTitle?: React.ReactNode
  cardDescription?: React.ReactNode
  cardIcon?: React.ReactNode
  cardFooter?: React.ReactNode
  headerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  iconClassName?: string
  footerClassName?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, headerClassName, titleClassName, descriptionClassName, iconClassName, footerClassName, cardTitle, cardDescription, cardIcon, cardFooter, children, ...props }: CardProps, ref) => (
  <div data-testid="card" ref={ref} className={cn("rounded-lg border group border-purple-500 bg-gradient-to-br from-purple-900 to-indigo-600  hover:bg-gradient-to-br hover:from-purple-800 hover:to-indigo-400 shadow-md", className )} {...props}>
      {(cardIcon || cardTitle || cardDescription) && (
        <header data-testid="card-header" className={cn("flex flex-col items-start gap-8 ml-5", headerClassName)}>
          <div className="flex mt-5 gap-4">
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

export  { Card }
