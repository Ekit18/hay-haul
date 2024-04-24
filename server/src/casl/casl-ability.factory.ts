import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Delivery } from 'src/delivery/delivery.entity';
import { User } from 'src/user/user.entity';
import { Action } from './actions.enum';
import { Injectable } from '@nestjs/common';

type Subjects = InferSubjects<typeof Delivery | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        can([Action.Update, Action.Delete,], Delivery,
            { carrierId: user.id } //Mongo query to check if user can do actions for this delivery :|
        );

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}