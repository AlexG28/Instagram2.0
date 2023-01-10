describe('Home Page Test', () =>{
    it('successfully loads', () => {
        cy.visit('/')

        cy.contains("Alex")

        cy.contains("69 Likes")
        cy.contains("Like this post").click()
        cy.contains("70 Likes")
    })
})


describe(
    'Login Test', 
    {
        env: {
            TEST_EMAIL:"alex.gyumushyan@gmail.com",
            TEST_PASSWORD:"123456"
        },
    },
    
    ()=>{  
        it('successfully login', ()=>{
            cy.visit('/')
           
            cy.get("#emailTextBox").type(Cypress.env('TEST_EMAIL'))
            cy.get("#passwordTextBox").type(Cypress.env('TEST_PASSWORD'))
            cy.get("#SignInButton").click()

            cy.contains("Logged in")
        })
})