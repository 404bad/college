% FACTS
male(ram_bahadur).
male(krishna).
male(suresh).
male(aakash).
male(roshan).

female(durga).
female(priya).
female(kopila).
female(menuka).

parent(ram_bahadur, krishna).
parent(ram_bahadur, durga).
parent(krishna, priya).
parent(krishna, suresh).
parent(suresh, aakash).
parent(suresh, kopila).
parent(durga, roshan).
parent(durga, menuka).


% RULES — Ancestor and Descendant

% ancestor(X, Y) :- parent(X, Y).
% "X is an ancestor of Y IF X is a parent of Y"
% ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).  "X is an ancestor of Y IF X is a parent of Z AND Z is an ancestor of Y"
% descendant(X, Y) :- ancestor(Y, X). X is a descendant of Y IF Y is an ancestor of X

ancestor(X, Y) :- parent(X, Y).
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).

descendant(X, Y) :- ancestor(Y, X).


% ------------------------------------------------------------
%         FAMILY TREE STRUCTURE
% ------------------------------------------------------------
%
    %         ram_bahadur
    %        /        \
    %    krishna      durga
    %     /   \        /   \
    %  priya suresh  roshan menuka
    %          / \
    %       aakash kopila
%


% RULES — Sibling
% "X and Y are siblings IF same parent P has both X and Y AND X is not Y"

sibling(X, Y) :- parent(P, X), parent(P, Y),X \= Y.

brother(X, Y) :- sibling(X, Y), male(X).
sister(X, Y)  :- sibling(X, Y), female(X).

% RULES — Aunt and Uncle
% X is uncle of Y IF P is parent of Y AND X is sibling of P AND X is male
uncle(X, Y) :- parent(P, Y), sibling(X, P), male(X).
aunt(X, Y)  :- parent(P, Y), sibling(X, P), female(X).


% RULE — Cousin
% X and Y are cousins IF PX is parent of X AND PY is parent of Y AND PX and PY are siblings
cousin(X, Y) :-  parent(PX, X), parent(PY, Y), sibling(PX, PY).