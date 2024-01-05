describe(
    'Login Test', 
    {
        env: {
            TEST_EMAIL:"testemail@gmail.com",
            TEST_PASSWORD:"123456"
        },
    },
    
    ()=>{  
        it('successfully login', ()=>{
            cy.visit('/')
           
            cy.get("#emailTextBox").type(Cypress.env('TEST_EMAIL'))
            cy.get("#passwordTextBox").type(Cypress.env('TEST_PASSWORD'))
            cy.get("#SignInButton").click()
            
        }),
        it('successfully loads images', () => {
            cy.visit('/')

            cy.get("#emailTextBox").type(Cypress.env('TEST_EMAIL'))
            cy.get("#passwordTextBox").type(Cypress.env('TEST_PASSWORD'))
            cy.get("#SignInButton").click()
    
            cy.contains("0 Likes")
            cy.contains("Like this post").click()
            cy.contains("1 Likes")
        })
    }
)
