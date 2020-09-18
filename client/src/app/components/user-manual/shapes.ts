import { Items } from './sections';

export const shapes: Items[] = [
    {
        name: 'Ligne',
        description:
            'Cet outil permet de tracer une ligne composée d\'un ou plusieurs segments. Un premier clic définit ' +
            'la position de départ de la ligne. Ensuite, chaque clic qui suit «se  connecte » avec le clic précédent ' +
            'pour former un segment de la ligne. Si la touche \'Shift\' est enfoncée, le segment en cours de ' +
            'construction s\'oriente selon des angles de 45° ( 0, 45, 90, 135, 180, etc ) et la position choisie ' +
            'sera la position la plus proche avant que \'Shift\' ne soit enfoncée. Dès que la touche est relâchée ' +
            'le segment temporaire recommence à utiliser la position du pointeur de la souris pour son deuxième ' +
            'point. L\'utilisateur peut terminer le traçage de la ligne avec un double clic. L\'utilisateur peut ' +
            'annuler le traçage complet de la ligne avec la touche \'ESCAPE\'. La touche \'BACKSPACE\' permet ' +
            'd\'annuler le segment le plus récent. L\'utilisateur peut définir s\'il veut afficher des points de ' +
            'jonction entre les segments. Il peut également configurer l\'épaisseur de la ligne, ainsi que ' +
            'l\'épaisseur des points de jonction s\'ils sont présents. Il est possible de sélectionner l\'outil ' +
            'Ligne avec la touche \'L\' du clavier.'
    },
    {
        name: 'Rectangle',
        description:
            'Cet outil permet de dessiner des rectangles. À tout moment pendant la création, si la touche \'Shift\' ' +
            'est maintenue enfoncée, la forme à créer devient alors un carré plutôt qu\'un rectangle. L\'utilisateur ' +
            'peut configurer l\'épaisseur du contour mais aussi le type de tracé : rectangle avec contours seulement ' +
            '; rectangle plein sans contours ; et rectangle plein avec contours. L\'intérieur d\'un rectangle est ' +
            'dessiné avec la couleur principale alors que les contours sont dessinés avec la couleur secondaire. ' +
            'Il est possible de sélectionner l\'outil Rectangle avec la touche \'1\' du clavier.'
    },
    {
        name: 'Ellipse',
        description:
            'L\' outil ellipse adopte le même comportement que celui permettant de dessiner des rectangles. La seule' +
            'différence est que la forme dessinée est une ellipse. Comme pour l\'outil rectangle, l\'utilisation de la' +
            'touche Shift aura un effet. Ici, elle transformera l’ellipse en cercle. Il est possible pour l\'utilisateur' +
            'de choisir le type de tracé ainsi que l\' epaisseur du trait de contour de l\'ellipse.'
    },
    {
        name: 'Polygone',
        description:
            'L\' outil  polygone fonctionne comme les deux précédents (avec le choix pour le types de tracé etl\' épaisseur du trait). ' +
            'Il permet toutefois à l\'utilisateur de spécifier le nombre de côtés de la forme à dessiner (les polygones sont ' +
            'reguliers et convexes).'
    }
];
