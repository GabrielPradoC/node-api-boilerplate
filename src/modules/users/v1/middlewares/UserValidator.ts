// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { User } from '../../../../library/database/entity';

/**
 * UserValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class UserValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        name: BaseValidator.validators.name,
        email: BaseValidator.validators.email,
        phoneNumber: BaseValidator.validators.phoneNumber,
        isActive: BaseValidator.validators.isActive,
        id: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: 'Usuário não encontrado'
        },
        duplicate: {
            errorMessage: 'Usuário já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByName(req.body.name);

                        check = user ? req.body.id === user.id.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    /**
     * updateModel
     *
     * Schema para validação de usuário na rota put
     */
    private static updateModel: Schema = {
        minOneProperty: {
            errorMessage: 'É necessário no mínimo uma propriedade para ser alterada!',
            custom: {
                options: (_: string, { req }) => {
                    const { email, name, phoneNumber, isActive } = req.body;
                    return (email || name || phoneNumber || isActive) !== undefined;
                }
            }
        },
        name: { ...BaseValidator.validators.name, optional: true },
        email: { ...BaseValidator.validators.email, optional: true },
        phoneNumber: { ...BaseValidator.validators.phoneNumber, optional: true },
        isActive: { ...BaseValidator.validators.isActive, optional: true }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return UserValidator.validationList({
            name: UserValidator.model.name,
            email: BaseValidator.validators.email,
            phoneNumber: BaseValidator.validators.phoneNumber,
            isActive: BaseValidator.validators.isActive,
            duplicate: UserValidator.model.duplicate
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return UserValidator.validationList({
            id: UserValidator.model.id,
            ...UserValidator.updateModel
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: UserValidator.model.id
        });
    }
}
