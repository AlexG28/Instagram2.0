describe('Home Page Test', () =>{
    it('successfully loads', () => {
        cy.visit('/')

        cy.contains("Alex")

        cy.contains("69 Likes")
        cy.contains("Like this post").click()
        cy.contains("70 Likes")
    })
})