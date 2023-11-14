const {Router} = require('express');
const{Characterslist, listCharacterByID, addCharacter, deleteCharacter, updateCharacter} = require('../controllers/characters');
const router = Router();
//http://localhost:3000/api/v1/personajes
router.get('/', Characterslist);
router.get('/:id', listCharacterByID);
router.put('/', addCharacter);
router.patch('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

module.exports = router;