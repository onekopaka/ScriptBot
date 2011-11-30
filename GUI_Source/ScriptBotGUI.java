/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ScriptBotGUI;

import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ScriptableObject;

/**
 *
 * @author Nareshkumar Rao
 * 
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
            "setUtil",
            "feedback"
        };
        scope.defineFunctionProperties(name, ScriptBotGUI.class, ScriptableObject.DONTENUM);

        try {
            cx.evaluateReader(scope, new FileReader(java.lang.System.getProperty("user.dir")+"/app/run.js"), "run.js", 0, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        System.out.println("Current Directory: "+java.lang.System.getProperty("user.dir"));
        mainGUI.run();
    }

    public static void print(String toPrint) {
        System.out.println(toPrint);
    }

    public static configType getConf() {
        String configFile = readFile(java.lang.System.getProperty("user.dir")+"/config.txt");
        Gson configJSON = new Gson();
        configType config = configJSON.fromJson(configFile, configType.class);
        return config;
    }

    public static void saveConf(configType conf) {
        try {
            // Create file 
            FileWriter fstream = new FileWriter(java.lang.System.getProperty("user.dir")+"/config.txt");
            BufferedWriter out = new BufferedWriter(fstream);
            out.write(new Gson().toJson(conf));
            //Close the output stream
            out.close();
        } catch (Exception e) {//Catch exception if any
            System.err.println("Error: " + e.getMessage());
        }
    }
    public static void feedback(String fb)
    {
        if("IRC_CONNECTED".equals(fb)) mainGUI.running(1);
    }
}

class configType {

    public String info;
    public String name;
    public String password;
    public String prefix;
    public String server;
    public String[] channels;
    public String[] plugins;
}