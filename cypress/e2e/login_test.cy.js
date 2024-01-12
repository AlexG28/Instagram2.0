describe(
    'Login Test', 
    {
        env: {
            TEST_EMAIL:"testemail@gmail.com",
            TEST_PASSWORD:"123456"
        },
    },
    
    ()=>{  
        it('can successfully login', ()=>{
            // cy.intercept('POST', '**/auth/v1/token?grant_type=password').as('authRequest')
            
            cy.log("tesststststss")

            cy.intercept('POST', '**/auth/v1/token?grant_type=password', (req) => {
                req.reply({
                    statusCode: 200,
                    body: {}
                })
            
            }).as('authRequest')


            cy.visit('/#/signin')
            
            cy.get("#emailTextBox").type(Cypress.env('TEST_EMAIL'))
            cy.get("#passwordTextBox").type(Cypress.env('TEST_PASSWORD'))
            cy.get("#SignInButton").click()        
            


            cy.wait('@authRequest').its('response.statusCode').should('eq', 200)
            
            // cy.get("#SignInButton")
            // https://nnhiufnpncvtpbvwlgsc.supabase.co/auth/v1/token?grant_type=password


        })
        
        it('can alert wrong login info', () => {
            
            cy.intercept('POST', '**/auth/v1/token?grant_type=password', (req) => {
                req.reply({
                    statusCode: 400,
                    body: {}
                })
            
            }).as('authRequest')
            cy.visit('/#/signin')

            cy.get("#emailTextBox").type('randomemail@gmail.com')
            cy.get("#passwordTextBox").type('randompassword')

            cy.get("#SignInButton").click()

            cy.wait('@authRequest').its('response.statusCode').should('eq', 400)
            cy.on('window:alert', (text) => {
                expect(text).to.contains('Invalid login credentials')
            })
        })
    }
)
