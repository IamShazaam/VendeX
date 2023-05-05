# VendeX

# First Commit:
    -   Implement the `/users/invalidateToken/:id` endpoint. The endpoint should invalidate 
        the JWT that is associated with the   user of id `id`.

# Second Commit: 
    -   Add a many-to-many relationship between users and company.

# Third Commit: 
    -   Add so that when calling `/users` the company data linked to the user is also retuned.

# Fourth Commit: 
    -   **Bonus 🚨:** There is a security vulnerability in one of the `users` endpoints 
        (Disrecarding the very busted login endpoint). If you can find it 
        - describe the issue and patch the vulnerability.