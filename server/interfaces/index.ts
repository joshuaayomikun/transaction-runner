import { Request, Response } from "express";
import { ModelCtor, Sequelize } from "sequelize-typescript";

export interface IModel {
    UserAccount: ModelCtor,
    Transaction: ModelCtor
}

export interface IRequest {
    req: Request; 
    res: Response;
}