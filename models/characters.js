const usersModel = {
    getAll: `
        SELECT * FROM personajes LIMIT 5`,

    getByID:`SELECT * FROM personajes WHERE id= ?`, 

    addRow: `INSERT INTO personajes (Personajes, Power_Level, Saga_or_Movie, Dragon_Ball_Series)
              VALUES (?, ?, ?, ?)`,
              
    getByCharacter: `
    SELECT * FROM personajes WHERE Personajes = ?`,


    updateRow: `UPDATE personajes SET
                 Personajes = ?,
                 Power_Level = ?,
                 Saga_or_Movie = ?,
                 Dragon_Ball_Series = ?
                 WHERE id =?`,

    deleteRow: `UPDATE personajes SET Power_Level = 0 WHERE id = ?`,

};

module.exports = usersModel;