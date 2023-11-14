const {request, response} = require('express');
const bcrypt = require('bcrypt');
const charactersModel = require('../models/characters');
const pool = require('../db');

const Characterslist = async (req=request, res = response) =>{
    let conn;
    try {
         conn = await pool.getConnection();

         const characters = await conn.query(charactersModel.getAll, (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         res.json(characters);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    } 
}

const listCharacterByID = async (req=request, res = response) =>{
    const {id} = req.params;
 
    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn;
    try {
         conn = await pool.getConnection();

         const [character] = await conn.query(charactersModel.getByID, [id], (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         if (!character) {
            res.status(404).json({msg: 'Character not found'});
            return;
         }

         res.json(character);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    } 
}

const addCharacter = async (req = request, res = response) => {
    const{
        Personajes,
        Power_Level, 
        Saga_or_Movie,
        Dragon_Ball_Series
    } = req.body;

    if (!Personajes || !Power_Level || !Saga_or_Movie || !Dragon_Ball_Series) {
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const character = [Personajes, Power_Level, Saga_or_Movie, Dragon_Ball_Series];

    let conn;

    try {
        conn = await pool.getConnection();

        const [nameCharacter] = await conn.query(charactersModel.getByCharacter, [Personajes], (error) => {
            if (err) throw err;
        });

        if (nameCharacter) {
            res.status(409).json({msg: `Character with name ${Personajes} already exists`});
            return;
        }

        const characterAdded = await conn.query(charactersModel.addRow, [...character], (err) => {
            if (err) throw err;
        })
        
        
        if (characterAdded.affectedRows === 0) throw new Error({msg: 'Failed to add character'});

        res.json({msg: 'Character added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }

}


const updateCharacter = async (req = request, res = response) => {

    const{
        Personajes,
        Power_Level, 
        Saga_or_Movie,
        Dragon_Ball_Series
    } = req.body;
    const {id} = req.params;

  
    let newCharacterData = [
        Personajes,
        Power_Level, 
        Saga_or_Movie,
        Dragon_Ball_Series
    ];
  
    let conn;

    try {
        conn = await pool.getConnection();

        
        const [characterExists] = await conn.query (
            charactersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!characterExists) {
            res.status(404).json({msg: 'Character not found'});
            return
        }
        const [nameCharacter] = await conn.query(charactersModel.getByCharacter, [Personajes], (error) => {
            if (err) throw err;
        });

        if (nameCharacter) {
            res.status(409).json({msg: `Character with name ${Personajes} already exists`});
            return;
        }

        const oldCharacterData = [
            characterExists.Personajes,
            characterExists.Power_Level,
            characterExists.Saga_or_Movie,
            characterExists.Dragon_Ball_Series
        ];

        newCharacterData.forEach((characterData, index) => {
            if (!characterData) {
                newCharacterData[index] = oldCharacterData[index];
            }
        });
    

        const characterUpdated = await conn.query(charactersModel.updateRow, [...newCharacterData, id], (err) => {
            if (err) throw err;
        });
        
        
        if (characterUpdated.affectedRows === 0) throw new Error({msg: 'Character not updated'});

        res.json({msg: 'Character updated succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}


const  deleteCharacter = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {id} = req.params;

        const [characterExists] = await conn.query (
            charactersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!characterExists) {
            res.status(404).json({msg: 'Character not found'});
            return;
        }

        const characterDeleted = await conn.query (
            charactersModel.deleteRow, [id], (err) => {if (err) throw err;}
        );

        if (characterDeleted.affectedRows === 0) {
            throw new Error({msg: 'Failed to delete character'})
        };

        res.json({msg: 'Character delete succesfully'});
        }catch (error) {
            console.log(error);
            res.status(500).json(error);
        } finally {
            if (conn) conn.end();
        }
    }



module.exports = {Characterslist, listCharacterByID, addCharacter, updateCharacter, deleteCharacter};