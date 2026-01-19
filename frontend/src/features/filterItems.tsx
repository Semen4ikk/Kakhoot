import type {QuizListCardOutput} from "../entities/quiz/model/QuizList.tsx";


export const filterItems = function (items: QuizListCardOutput[], searchQuery: string): QuizListCardOutput[] {
     return items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
}
