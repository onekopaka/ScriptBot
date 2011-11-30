/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ScriptBotGUI;

import java.io.BufferedReader;
import java.io.FileReader;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ScriptableObject;

/**
 *
 * @author root
 */
public class ScriptBotGUI {

    public static Object storedCore;

    public static void storeCore(Object core) {
        storedCore = core;
    }

    public static Object getCore() {
        return storedCore;
    }
    public static Object storedUtil;

    public static void setUtil(Object util) {
        storedUtil = util;
    }

    public static Object getUtil() {
        return storedUtil;
    }

    public static String readFile(String path) {
        String loaded = "";
        try {
            FileReader runScript = new FileReader(path);
            BufferedReader bufRead = new BufferedReader(runScript);
            String line;
            int count = 0;
            line = bufRead.readLine();
            count++;

            while (line != null) {
                loaded = loaded + line + "\n";
                line = bufRead.readLine();
                count++;
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return loaded;
    }

    public static void RunBot() {
        Context cx = Context.enter();
        ScriptableObject scope = cx.initStandardObjects();

        String[] name = {
            "print",
            "readFile",
            "storeCore",
            "getCore",
            "getUtil",
            "setUtil"
        };
        scope.defineFunctionProperties(name, ScriptBotGUI.class, ScriptableObject.DONTENUM);

        try {
            cx.evaluateReader(scope, new FileReader("./ScriptBot/src/app/run.js"), "run.js", 0, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        mainGUI.run();
    }

    public static void print(String toPrint) {
        System.out.println(toPrint);
    }
}
